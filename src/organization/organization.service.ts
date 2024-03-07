import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './entities/organization.entity';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { sendEmail } from 'src/auth/email.helper';




@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
   

  ) { }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<any> {
    try {

      // Create a new organization
      const newOrganization = new this.organizationModel(createOrganizationDto);
      const data = await newOrganization.save();

      // send email
      sendEmail(createOrganizationDto.email, 'Welcome to Our Organization!', `
        <html>
        <body>
        <p>Dear ${createOrganizationDto.name},</p>

        <p>Thank you for registering with our organization. We are thrilled to have you on board and look forward to working with you.</p>

        <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>

        <p>Email: information@gmail.com<br/>
        Contact Number: <a href="tel:1234567890">1234567890</a></p>

        <p>Best regards,<br/>
        Vidyam Group</p>
        </body>
        </html>
      `);


      return {
        success: true,
        message: "Organization created successfully",
        data: data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  }

  async findAll(): Promise<any> {
    try {
      const data = await this.organizationModel.find({ status: true }).exec();
      return {
        success: true,
        message: "Organization list",
        data: data
      }

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }

    }

  }



  async findOne(id: string): Promise<any> {
    try {
      const data = await this.organizationModel.findById(id).exec();
      return {
        success: true,
        message: "Organization list by id",
        data: data
      }

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }

  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      // Find the organization by ID
      const organization = await this.organizationModel.findByIdAndUpdate(id, updateOrganizationDto, { new: true }).exec();

      // If the organization is not found, throw NotFoundException
      if (!organization) {
        return {
          success: false,
          message: "Organization not found",
          data: []
        }
      }
      return {
        success: true,
        message: "Organization updated successfully...!",
        data: organization
      }


    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }

    }

  }
  // Change the parameter type from 'number' to 'string'
  async remove(id: string) {

    try {
      // Find the organization by ID
      const organization = await this.organizationModel.findByIdAndUpdate(id, { status: false }, { new: true }).exec();

      // If the organization is not found, throw NotFoundException
      if (!organization) {
        return {
          success: false,
          message: "Organization not found",
          data: []
        }
      }
      return {
        success: true,
        message: "Organization deleted successfully...!",
        data: organization
      }


    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }

    }

  }

}
