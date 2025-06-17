# Notification Sounds

This directory contains audio files for the notification system.

## Required Files

Place the following audio files in this directory:

- `success.mp3` - Success notification sound
- `error.ogg` - Error notification sound  
- `warning.wav` - Warning notification sound
- `info.mp3` - Info notification sound

## Audio Format Support

The notification system supports multiple audio formats:
- MP3 (.mp3)
- OGG Vorbis (.ogg)
- WAV (.wav)

## File Requirements

- Keep file sizes small (< 100KB recommended)
- Use short duration sounds (0.5-2 seconds)
- Ensure consistent volume levels across all files
- Test across different browsers for compatibility

## Browser Compatibility

- Chrome: MP3, OGG, WAV
- Firefox: OGG, WAV
- Safari: MP3, WAV
- Edge: MP3, OGG, WAV

## Usage

The audio files are automatically loaded and cached when the notification system initializes. No additional configuration is needed beyond placing the files in this directory.