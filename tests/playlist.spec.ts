import { test, expect } from '@playwright/test';
import { trackTitles } from './data/tracks';
import { addTrackToPlaylist } from './utils/add-track';
import toSeconds from './utils/to-seconds';
test.describe('Playlist App', () => {
    const amountOfTracks = trackTitles.length;
    const searchSong = trackTitles[Math.floor(Math.random() * amountOfTracks)];
    test.describe('Playlist App - Search Functionality', () => {
        test('should filter tracks by search input', async ({ page }) => {
            await page.goto('/');
            const searchInput = await page.locator('//input[@id=":r0:"]');
            await searchInput.fill(searchSong);
            const tracks = await page.locator('#tracklist>div');
            const trackTitle = await page.locator('#tracklist>div p').first().innerText();
            expect(trackTitle).toContain(searchSong);
            expect(await tracks.count()).toBe(1);
        });
    });
    test.describe('Playlist App - Add Track Functionality', () => {
        test('Add Track Using "+" Button: adds track to playlist', async ({ page }) => {
            await page.goto('/');
            const addButton = await page.locator('#tracklist>div button').first();
            const trackTitle = await page.locator('#tracklist>div p').first().innerText();
            await addButton.click();
            // Перевіряємо, що трек з'явився у плейлисті
            const playlistTracks = await page.locator('#playlist>div>div p').first();
            const titles = await playlistTracks.allInnerTexts();
            console.log('here', titles, 'title', trackTitle);
            expect(titles).toContain(await trackTitle);
        });
    });
    test.describe('Playlist App - Total Duration Calculation', () => {
        test('Verify Total Duration of the Playlist in Seconds', async ({ page }) => {
            await page.goto('/');
            const addedIndexes = [1, 2];
            const expectedDurations = 420; // 3:00 + 4:00 = 7:00 = 420 seconds
            for (const i of addedIndexes) {
                await addTrackToPlaylist(page, i);
            }
            const playlistTracks = await page.locator('#playlist>div>div button').locator('xpath=preceding-sibling::div[1]');
            const durations = await playlistTracks.allInnerTexts();
            const actualDurations = durations.map(toSeconds).reduce((a, b) => a + b, 0);
            expect(expectedDurations).toBe(actualDurations);
            const playlistDurationStr = await page.locator('#playlist-duration').innerText();
            const shownDuration = Number(playlistDurationStr);
            expect(shownDuration).toBe(actualDurations);
        });
    });
});
