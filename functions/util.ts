import { Page } from "@playwright/test";

class Utility {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async getImgModal() {
    let table_img: any[] = [];

    const table_data_img = await this.page
      .locator('//tbody//img[@class="img-responsive program-img"]')
      .all();

    for (let data_img of table_data_img) {
      await data_img.click();
      await this.page.waitForTimeout(1500);
      const imgs = await this.page
        .locator('//div[@class="slick-track"]//img')
        .evaluateAll((img) => {
          return img.map((img_car) => ({
            blob_url: img_car.getAttribute("data-url"),
            url: img_car.getAttribute("src"),
          }));
        });
      table_img.push(imgs);
      await this.page
        .locator('//button[@class="popup-icon pull-right"]')
        .click();
    }

    return table_img;
  }
}

export const Util = Utility;
