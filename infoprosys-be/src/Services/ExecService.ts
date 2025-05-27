import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/user.entity";


@Injectable()
export class execService{

    constructor(
        @InjectModel(User.name) private usermodel: Model<User>
    ){}

    async getVendor(id: string) {
  const vendor = await this.usermodel.findOne({ _id: id, role: 'vendor' }).select('-password').exec();
  if (!vendor) {
    throw new NotFoundException('Vendor not found');
  }
  return {
    success: true,
    data: vendor,
  };
}

async getAllVendors() {
  const vendors = await this.usermodel.find({ role: 'vendor' }).select('-password').exec();
  if (!vendors || vendors.length === 0) {
    throw new NotFoundException('No vendors found');
  }
  return {
    success: true,
    data: vendors,
  };
}
async getPendingVendors() {
    const vendors = await this.usermodel.find({ 
      role: 'vendor',
      status: 'pending'
    }).select('-password').exec();
    
    if (!vendors || vendors.length === 0) {
      throw new NotFoundException('No pending vendors found');
    }
    return {
      success: true,
      data: vendors,
    };
  }

  async getApprovedVendors() {
    const vendors = await this.usermodel.find({ 
      role: 'vendor',
      status: 'approved'
    }).select('-password').exec();
    
    if (!vendors || vendors.length === 0) {
      throw new NotFoundException('No approved vendors found');
    }
    return {
      success: true,
      data: vendors,
    };
  }

  async getRejectedVendors() {
    const vendors = await this.usermodel.find({ 
      role: 'vendor',
      status: 'rejected'
    }).select('-password').exec();
    
    if (!vendors || vendors.length === 0) {
      throw new NotFoundException('No rejected vendors found');
    }
    return {
      success: true,
      data: vendors,
    };
  }
}