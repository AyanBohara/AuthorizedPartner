import { test, expect } from '@playwright/test';
test('Login functionality testing',async({page})=>{
    await page.goto('https://authorized-partner.vercel.app/')
    await page.getByRole('link',{name:'Login'}).click()
    await page.getByRole('link',{name:'Sign Up'}).click()
    await page.locator('#remember').click()
    // await page.waitForTimeout(3000);
    await page.getByRole('button',{name:'Continue'}).click();
    await page.waitForTimeout(3000);


})