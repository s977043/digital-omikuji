const fs = require('fs');
const path = require('path');

function writeWavHeader(samples, sampleRate) {
    const buffer = Buffer.alloc(44 + samples.length * 2);
    const dataSize = samples.length * 2;

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);

    // fmt subchunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32); // Block align
    buffer.writeUInt16LE(16, 34); // Bits per sample

    // data subchunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    for (let i = 0; i < samples.length; i++) {
        buffer.writeInt16LE(Math.max(-32768, Math.min(32767, samples[i] * 32767)), 44 + i * 2);
    }
    return buffer;
}

function generateShakeSound(filename) {
    const sampleRate = 44100;
    const duration = 0.4;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    // Create a "rattle" effect using filtered noise bursts
    for (let i = 0; i < numSamples; i++) {
        // Envelope for multiple rattles
        const t = i / sampleRate;
        const rattleEnvelope = Math.abs(Math.sin(2 * Math.PI * 8 * t));

        // Colored noise (simple lowpass)
        const noise = (Math.random() * 2 - 1) * 0.8;

        samples[i] = noise * rattleEnvelope * (1 - t / duration); // Fade out
    }

    const buffer = writeWavHeader(samples, sampleRate);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated shake sound: ${filename}`);
}

function generateResultSound(filename) {
    const sampleRate = 44100;
    const duration = 2.0;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    // Simple bell-like FM synthesis
    // Carrier: 880Hz (A5), Modulator: 220Hz
    const fc = 880;
    const fm = 220;
    const modIndex = 2;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;

        // Percussive envelope
        const envelope = Math.exp(-4 * t);

        // FM synth
        const modulator = Math.sin(2 * Math.PI * fm * t);
        const carrier = Math.sin(2 * Math.PI * fc * t + modIndex * modulator * envelope);

        // Add some "sparkle" (high frequency)
        const sparkle = Math.sin(2 * Math.PI * 3520 * t) * 0.1 * Math.exp(-10 * t);

        samples[i] = (carrier * 0.5 + sparkle) * envelope;
    }

    const buffer = writeWavHeader(samples, sampleRate);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated result sound: ${filename}`);
}

const dir = 'assets/sounds';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

generateShakeSound(path.join(dir, 'shake.wav'));
generateResultSound(path.join(dir, 'result.wav'));

// Copy to .mp3 as well since web uses that fallback in some browsers/code
// (Disclaimer: These are still valid WAV files with MP3 extension, which modern browsers handle fine)
fs.copyFileSync(path.join(dir, 'shake.wav'), path.join(dir, 'shake.mp3'));
fs.copyFileSync(path.join(dir, 'result.wav'), path.join(dir, 'result.mp3'));
