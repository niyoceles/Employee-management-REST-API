import sgMail from '@sendgrid/mail';
import models from '../models';
import Auth from '../helpers/Auth';
import jwt from 'jsonwebtoken';
import client from '../helpers/redis';

const { managers } = models;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { SENDER_EMAIL, BACKEND_URL, SECRET } = process.env;

const expirationTime = {
  expiresIn: '1day'
};

class managerController {
  static async signUpManager(req, res) {
    const {
      managerNames,
      email,
      password,
      nationalId,
      phoneNumber,
      birthDate,
      status
    } = req.body;

    if (!managerNames) {
      return res.status(400).json({
        error: 'manager names are required'
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'password is required'
      });
    }

    const hashedPassword = Auth.hashPassword(password);

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

    const checkUserEmail = await managers.findOne({
      where: { email }
    });
    const checkUserNationalId = await managers.findOne({
      where: { nationalId }
    });
    const checkUserPhone = await managers.findOne({
      where: { phoneNumber }
    });

    if (checkUserEmail) {
      return res.status(400).json({
        error: 'this email already Exist'
      });
    }
    if (checkUserNationalId) {
      return res.status(400).json({
        error: 'this National Id already Exist'
      });
    }
    if (checkUserPhone) {
      return res.status(400).json({
        error: 'this phone number already Exist'
      });
    }

    try {
      const newManager = await managers.create({
        managerNames,
        email,
        password: hashedPassword,
        position: 'manager',
        nationalId,
        phoneNumber,
        birthDate,
        status: statusValue
      });
      if (newManager) {
        const token = Auth.getToken(newManager.id, email, managerNames);
        const msg = {
          to: email,
          from: `${SENDER_EMAIL}`,
          subject: 'XYZ Account Verification',
          html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
            <h1 style="color: #444;">XYZ Company</h1>
            <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${managerNames},<br> Please verify your mail to enjoy premium access.<br> Click the blue button below to verify your account.</p>
            <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/managers/${token}">Verify Account</a>
            </a></p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for using our application!</p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,<br>ZYZ</p>
            </div>`
        };
        sgMail.send(msg);

        return res.status(200).json({
          user: newManager,
          message: ' manager successful created'
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Failed to create manager account'
      });
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        error: 'email is required'
      });
    }
    if (!password) {
      return res.status(400).json({
        error: 'password is required'
      });
    }
    try {
      const checkUser = await managers.findOne({
        where: {
          email
        }
      });

      const checkUserVerified = await managers.findOne({
        where: {
          email,
          isVerified: false
        }
      });

      if (!checkUser) {
        return res.status(404).json({ error: 'user not found' });
      }

      const compared = Auth.comparePassword(password, checkUser.password);
      if (!compared) {
        return res.status(404).json({
          error: 'Email and Password are not match'
        });
      }
      if (checkUserVerified) {
        return res.status(400).json({
          error: 'your account is not verified, Please verify your account'
        });
      }
      return res.status(200).json({
        User: {
          email,
          names: checkUser.managerNames,
          token: Auth.getToken(checkUser.id, email, checkUser.managerNames)
        },
        message: 'successful sign in'
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to sign in' });
    }
  }

  static async verifyManager(req, res) {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    try {
      const verified = await managers.update(
        { isVerified: true },
        { where: { id: decodedToken.id } }
      );
      if (!verified) {
        return res.status(404).json({
          error: 'Failed to verify your accountgg'
        });
      }
      return res.status(200).json({
        message: 'You are successful verified your account'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to verify your account' });
    }
  }

  static async sendLinkResetPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        error: 'email is required'
      });
    }
    try {
      const checkUser = await managers.findOne({
        where: {
          email
        }
      });
      if (checkUser) {
        const payload = {
          email: checkUser.email
        };
        const token = jwt.sign(payload, SECRET, expirationTime);
        // req.body.token = token;
        // req.body.template = 'resetPassword';
        // sendEmail(user.email, token, 'resetPassword');

        const msg = {
          to: email,
          from: `${SENDER_EMAIL}`,
          subject: 'Reset your password',
          html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
            <h1 style="color: #444;">${checkUser.managerNames} Please reset your password</h1>
            <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left"><br> Click the link button below to reset your password.</p>
            <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/managers/get/${token}">Reset password Link </a>
            </a></p>
            </div>`
        };
        sgMail.send(msg);
        return res.status(200).send({
          message:
            'We have sent a password reset link to your email, Please check your email'
        });
      }
      return res
        .status(404)
        .json({ error: 'The email provided does not exist' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  static getToken(req, res) {
    return res.status(200).json({ token: req.params.token });
  }

  static async resetPassword(req, res) {
    const { password } = req.body;
    if (!password) {
      return res.status(403).json({ error: 'new password is required' });
    }
    const hashedPassword = Auth.hashPassword(password);
    const { token } = req.params;
    try {
      const decoded = await jwt.decode(token, SECRET);
      if (decoded) {
        const checkUpdate = await managers.update(
          {
            password: hashedPassword
          },
          {
            where: {
              email: decoded.email
            }
          }
        );
        if (checkUpdate.length >= 1) {
          return res
            .status(200)
            .json({ message: 'You have successfully reset your password' });
        }
      }
      return res
        .status(403)
        .json({ error: 'Permission to access this resource has been denied' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: 'Failed to reset password' });
    }
  }

  static async signoutManager(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      await client.set(token, 'Blacklisted'); // Blacklist the token and store it in redis
      return res.status(200).json({
        message: 'successfully signed out'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'failed to signout'
      });
    }
  }
}

export default managerController;
