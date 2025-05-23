import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/user.entity";


@Injectable()
export class execService{

    constructor(
        @InjectModel(User.name) private usermodel: Model<User>
    ){}


    async getVendor(id: string){
        const vendor  = await this.usermodel.findById(id).select('-password').exec();
         if (!vendor) {
              throw new NotFoundException('Vendor not found');
            }
            return {
              success: true,
              data: vendor,
            };
    }

  async getAllVendors() {
  const vendors = await this.usermodel.find().select('-password').exec(); // Use find() not findAll()
  if (!vendors || vendors.length === 0) {
    throw new NotFoundException('No vendors found');
  }
  return {
    success: true,
    data: vendors,
  };
}

}