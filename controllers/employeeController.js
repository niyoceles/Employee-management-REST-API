import sgMail from '@sendgrid/mail';
import Sequelize from 'sequelize';
import models from '../models';

const { Op } = Sequelize;

const { employees } = models;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { SENDER_EMAIL } = process.env;

class employeeController {
  static async checkExist(req, res) {
    const { email, phoneNumber, nationalId } = req.body;
    const checkUserEmail = await employees.findOne({
      where: { email }
    });
    const checkUserNationalId = await employees.findOne({
      where: { nationalId }
    });
    const checkUserPhone = await employees.findOne({
      where: { phoneNumber }
    });

    if (checkUserEmail) {
      return res.status(400).json({
        error: 'this email already Exist'
      });
    } else if (checkUserNationalId) {
      return res.status(400).json({
        error: 'this National Id already Exist'
      });
    } else if (checkUserPhone) {
      return res.status(400).json({
        error: 'this phone number already Exist'
      });
    } else {
    }
  }
  static async createEmployee(req, res) {
    const {
      employeeNames,
      email,
      position,
      nationalId,
      phoneNumber,
      birthDate,
      status
    } = req.body;

    let statusValue = true;

    if (status === 'active') {
      statusValue = true;
    } else if (status === 'inactive') {
      statusValue = false;
    } else if (status !== ('active' || 'inactive')) {
      return res.status(400).json({
        error: 'status should be active or inactive'
      });
    } else {
    }

    if (!employeeNames) {
      return res.status(400).json({
        error: 'employee names are required'
      });
    }
    if (!position) {
      return res.status(400).json({
        error: 'position is required'
      });
    } else if (position !== ('manager' || 'developer' || 'designer')) {
      return res.status(400).json({
        error: 'status should be manager or developer'
      });
    } else {
    }
    try {
      employeeController.checkExist(req, res);

      const newEmployee = await employees.create({
        employeeNames,
        email,
        position,
        nationalId,
        phoneNumber,
        birthDate,
        status: statusValue
      });
      if (newEmployee) {
        const msg = {
          to: email,
          from: `${SENDER_EMAIL}`,
          subject: 'Welcome to XYZ company',
          html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
            <h1 style="color: #444;">Welcome to XYZ company!</h1>
            <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${employeeNames},<br> We are happy to have you in our company.
            <br> As you can see your account have registered successful.</p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for your commitment!</p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,
            <br> XYZ company</p>
            </div>`
        };
        sgMail.send(msg);
        return res.status(200).json({
          employee: newEmployee,
          message: ' employee successful created'
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async updateEmployee(req, res) {
    const {
      employeeNames,
      email,
      position,
      nationalId,
      phoneNumber,
      birthDate,
      status
    } = req.body;
    const { id } = req.params;

    let statusValue = true;

    if (status === 'active') {
      statusValue = true;
    } else if (status === 'inactive') {
      statusValue = false;
    } else if (status !== ('active' || 'inactive')) {
      return res.status(400).json({
        error: 'status should be active or inactive'
      });
    } else {
    }

    if (!employeeNames) {
      return res.status(400).json({
        error: 'employee names are required'
      });
    }

    if (!position) {
      return res.status(400).json({
        error: 'position is required'
      });
    } else if (position !== ('manager' || 'developer' || 'designer')) {
      return res.status(400).json({
        error: 'status should be manager, developer or designer'
      });
    } else {
    }

    try {
      const updateEmployee = await employees.update(
        {
          employeeNames,
          email,
          position,
          nationalId,
          phoneNumber,
          birthDate,
          status: statusValue
        },
        {
          where: {
            id
          }
        }
      );
      if (!updateEmployee) {
        return res.status(404).json({
          error: 'Failed to update employee'
        });
      }
      return res.status(200).json({
        message: 'employee updated successful'
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update employee' });
    }
  }

  static async activateEmployee(req, res) {
    // const { status } = req.body;
    const { id } = req.params;
    try {
      const activatingEmployee = await employees.update(
        { status: true },
        { where: { id } }
      );
      if (!activatingEmployee) {
        return res.status(404).json({
          error: 'Failed to activate employee'
        });
      }
      return res.status(200).json({
        message: 'employee activated successful'
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to activate employee' });
    }
  }

  static async suspendEmployee(req, res) {
    // const { status } = req.body;
    const { id } = req.params;
    try {
      const activatingEmployee = await employees.update(
        { status: false },
        { where: { id } }
      );
      if (!activatingEmployee) {
        return res.status(404).json({
          error: 'Failed to suspend employee'
        });
      }
      return res.status(200).json({
        message: 'employee suspendd successful'
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to suspend employee' });
    }
  }

  static async searchEmploye(req, res) {
    const { search } = req.body;

    try {
      const allemployees = await employees.findAll({
        where: {
          [Op.or]: [
            { employeeNames: search },
            { position: search },
            { email: search },
            { phoneNumber: search }
          ]
        }
      });
      if (!allemployees) {
        return res.status(404).json({
          error: 'Not found employees'
        });
      } else if (allemployees.length < 1) {
        return res.status(404).json({
          error: 'No Employee found'
        });
      }
      return res.status(200).json({
        User: allemployees,
        message: 'Get employees successful '
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to get employees' });
    }
  }

  static async allEmployees(req, res) {
    try {
      const allemployees = await employees.findAll();
      if (!allemployees) {
        return res.status(404).json({
          error: 'No Employee found'
        });
      }
      return res.status(200).json({
        User: allemployees,
        message: 'Get employees successful '
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get employees' });
    }
  }

  static async deleteEmployee(req, res) {
    const { id } = req.params;
    try {
      const delEmployee = await employees.destroy({
        where: {
          id
        }
      });
      if (!delEmployee) {
        return res.status(404).json({
          error: 'This employee is not found'
        });
      }
      return res.status(204).send('');
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
  }
}

export default employeeController;
