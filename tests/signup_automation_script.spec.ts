import { test, expect } from '@playwright/test';
test('Login functionality testing',async({page})=>{
    await page.goto('https://authorized-partner.vercel.app/')
    await page.getByRole('link',{name:'Login'}).click()
    await page.getByRole('link',{name:'Sign Up'}).click()
    await page.locator('#remember').click()
    // await page.waitForTimeout(3000);
    await page.getByRole('button',{name:'Continue'}).click();
    await page.waitForTimeout(3000);

  await expect(page.getByRole('heading',{name:"Complete Your Agent Profile in Steps"})).toBeVisible();
    await page.getByLabel('First Name').fill('Alice');
    await page.getByLabel('Last Name').fill('Doe')
    await page.getByLabel('Email Address').fill('ayan.aerialarts@gmail.com')
    // Open the visible country dropdown
await page.getByRole('combobox').click();

// Select India from the visible options
await page.getByRole('option', { name: /🇮🇳 \+91/ }).click();

// Fill the phone number
await page.getByPlaceholder('00-00000000').fill('9876543210');
await page.locator('input[name="password"]').fill('Alice@12345');

    // await page.waitForTimeout(3000);
    await page.locator('input[name="confirmPassword"]').fill('Alice@12345');
    await page.getByRole('button',{name:'Next'}).click();
    await page.waitForTimeout(3000);

//2nd page
await page.locator('input[autocomplete="one-time-code"]').fill('1830892');
    await page.waitForTimeout(3000);

await page.getByRole('button',{name:'Verify Code'}).click();
    await page.waitForTimeout(3000);

//Filling agency details
await page.getByLabel('Name').fill('Zyun');
await page.getByLabel('Role in Agency').pressSequentially('Art');
await page.getByLabel('Email Address').pressSequentially('a@gmail.com')
await page.getByLabel('Website').fill('www.youtube');
await page.getByLabel('Address').fill('Kathmandu');
await page.getByLabel('Role of Operation').click();
await page.locator('//*[@id="radix-_r_7s_"]/div[2]/div/div/div[2]/span').selectOption('Nepal');
await page.getByRole('button',{name:'Next'}).click();

//3.Professional Experience
await page.getByRole('combobox').click()
await page.locator('//*[@id="_r_7t_-form-item"]/span').selectOption('2 years')
await page.getByLabel('Number of Students Recruited Annually').fill("5");
await page.getByLabel('Focus Area').fill('Arts');
await page.getByLabel('Success Metrics').fill('50');
await page.getByRole('checkbox',{name:'Career Counseling'}).click();
await page.getByRole('checkbox',{name:'Visa Processing'}).click();
await page.getByRole('button',{name:'Next'}).click();

//Verification and Preference
await page.getByLabel('Business Registration Number').fill('52525')
await page.getByLabel('Preferred Countries').fill('Nepal')
await page.getByRole('checkbox',{name:'Universities'}).click();
await page.getByRole('checkbox',{name:'Colleges'}).click();
await page.getByText('Upload a file').setInputFiles('/home/ayan/Desktop/CV_Ayan Bohara.pdf');











})