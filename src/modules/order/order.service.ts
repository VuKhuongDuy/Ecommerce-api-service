import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APP_CONFIG_NAME } from 'src/configs/app.config';
// import { MailService } from 'src/mail/mail.service';
import { Discount, Order, Product, ProductOrder, User } from 'src/schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    // private mailService: MailService,
    private configService: ConfigService,
  ) {}

  get = async (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.orderModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.orderModel.findOne({ id: id }).exec();
  };

  create = async (body) => {
    const userInfo = body.user;
    const user = await this.getUser(userInfo);
    const orderInfo = body.order;
    const order = {
      user_order: user.id,
      state: '',
      voucher: orderInfo.voucher,
      user_note: orderInfo.note,
    } as Order;
    order.listproduct = await this.getFullProduct(orderInfo.listproduct);

    if (order.listproduct.length == 0) {
      throw new BadRequestException();
    }

    const { bill, enrichListProduct } = await this.caculBill(order);
    order.bill = bill;
    order.listproduct = enrichListProduct;
    const result = await this.orderModel.insertMany(order);

    // TODO sendmail
    this.sendMailNotify(result[0], userInfo.email);

    if (!result) {
      throw new BadRequestException();
    }
    return result[0];
  };

  update = () => {
    return null;
  };

  delete = () => {
    return null;
  };

  getUser = async (userInfo) => {
    const { phone, email } = userInfo;
    if (!phone || !email) {
      throw new BadRequestException();
    }
    const existedUser = await this.userModel.findOne({
      email: email,
      phone: phone,
    });
    if (!existedUser) {
      const result = await this.userModel.insertMany(userInfo);
      return result[0];
    }

    return existedUser;
  };

  getFullProduct = async (productOrders): Promise<ProductOrder[]> => {
    const result = [];
    const listPromise = productOrders.map((prod) => {
      return this.productModel.findOne({
        id: prod.id,
        delete_at: null,
      });
    });

    const products = await Promise.all(listPromise);
    products.forEach((element, index) => {
      if (element) {
        result.push({
          product: element,
          count: productOrders[index].count,
          property: productOrders[index].property,
        });
      }
    });

    return result;
  };

  caculBill = async (order) => {
    const voucher = await this.discountModel
      .findOne({ voucherCode: order.voucher, type: 'voucher' })
      .exec();
    let bill = 0;
    const enrichListProduct = [];

    // Tính bill theo discount
    const billForEachProduct = order.listproduct.map(async (productOrder) => {
      let totalMoneyOfEach = 0;
      const discounts = await this.discountModel.find({
        start_time: { $lte: new Date() },
        end_time: { $gte: new Date() },
        listproduct: { $elemMatch: { id: productOrder.product.id } },
      });

      if (discounts.length > 0) {
        // chỉ apply discount đầu tiên (không tính gộp nhiều discount)
        const discountForThisProduct = discounts[0].listproduct.find(
          (m) => m.id == productOrder.product.id,
        );

        if (discountForThisProduct) {
          const price = discountForThisProduct.price
            ? discountForThisProduct.price
            : (productOrder.product.selling_price *
                discountForThisProduct.percent) /
              100;

          totalMoneyOfEach = price * productOrder.count;

          productOrder.discount = discounts;
        }
      } else {
        totalMoneyOfEach =
          productOrder.product.selling_price * productOrder.count;
      }

      // Tính bill theo discount
      if (voucher && this.voucher_áp_dụng_cho_một_số_sp(voucher)) {
        console.log('Apply voucher');
        const index = voucher.listproduct.findIndex(
          (m) => m.id == productOrder.product.id,
        );
        if (index > 0) {
          const valueOfVoucher = voucher[index];
          totalMoneyOfEach = valueOfVoucher.price
            ? valueOfVoucher.price
            : (totalMoneyOfEach * valueOfVoucher.percent) / 100;
        }
      }

      return { bill: totalMoneyOfEach, product: productOrder };
    });

    const arr = await Promise.all(billForEachProduct);

    arr.forEach((p) => {
      bill += p.bill;
      enrichListProduct.push(p.product);
    });
    console.log({ bill });
    // Tính bill theo voucher
    if (voucher) {
      bill = !this.voucher_áp_dụng_cho_một_số_sp(voucher)
        ? bill * voucher.default_value
        : bill;
    }
    return { bill, enrichListProduct };
  };

  voucher_áp_dụng_cho_một_số_sp = (voucher) => {
    return voucher.listproduct.length > 0;
  };

  sendMailNotify = (order, userMail) => {
    const { hotline } = this.configService.get(`${APP_CONFIG_NAME}`);
    const mailUserContent = `
    <b>Hệ thống đã ghi nhận đơn hàng của bạn, tổng giá trị đơn hàng là: ${order.bill}</b><br/>
    Chi tiết xem tại: ${order.id}<br/>
    Chúng tôi xin cảm ơn<br/>
    ----------------------------<br/>
    Hotline: ${hotline}`;
    const mailAdminContent = `
    <b>Hệ thống đã ghi nhận đơn hàng mới, tổng giá trị đơn hàng là: ${order.bill}</b><br/>
    Chi tiết xem tại: ${order.id}<br/>
    ----------------------------<br/>
    Hotline: ${hotline}`;
    // this.mailService.sendMail(mailUserContent, userMail);
    // this.mailService.sendMail(mailAdminContent, null);
  };
}
