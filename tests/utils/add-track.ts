import { Page } from '@playwright/test';

export async function addTrackToPlaylist(page: Page, trackIndex = 0): Promise<string[]> {
    const addButton = await page.locator('#tracklist>div button').nth(trackIndex);
    const trackTitle = await addButton.locator('.. >> p').allInnerTexts();
    await addButton.click();
    console.log('Added track:', trackTitle);
    return trackTitle;
}
