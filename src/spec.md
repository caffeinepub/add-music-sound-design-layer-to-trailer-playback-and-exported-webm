# Specification

## Summary
**Goal:** Add a time-synced background audio layer to trailer playback and ensure exported WebM files include the mixed audio.

**Planned changes:**
- Add an audio layer to trailer playback that stays synchronized with timeline controls (play/pause/seek/reset), supports enable/disable, and provides basic volume control.
- Bundle at least one default audio track as a static frontend asset and add a simple track selector UI (even if only one track initially).
- Update trailer export so the downloaded WebM includes the audio layer mixed into the recording, respecting mute/disabled state at export time.
- Persist audio settings (enabled/disabled, volume, selected track) so refresh restores the last-used choices without impacting existing segment persistence.

**User-visible outcome:** Users can optionally play a selectable background audio track in sync with the trailer while previewing, control its volume and enabled state, have those settings restored after refresh, and download a WebM export that includes the audio (or is silent if audio is muted/disabled).
