class inputValidation {
  static async validateInput(req, res, next) {
    const { phoneNumber, nationalId, email, birthDate } = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // const nameRegex = /^[a-zA-Z ]*$/;

    let phoneRegex;
    if (phoneNumber === undefined) {
      phoneRegex = /^\w+$/;
    } else if (phoneNumber === '') {
      phoneRegex = /^[0-9]*$/;
    } else {
      phoneRegex = /^\+2507(?:[0-9] ?){7,7}[0-9]$/;
    }

    switch (true) {
      case email === null ||
        email === undefined ||
        phoneNumber === null ||
        phoneNumber === undefined ||
        nationalId === null ||
        nationalId === undefined ||
        birthDate === null ||
        birthDate === undefined:
        return res.status(400).json({
          error:
            'A valid email, phone number, names, national Id or birth date are required'
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250783067644'
        });

      // case nameRegex.test(employeeNames) === false:
      //   return res.status(400).json({
      //     error: 'Names should be alphabetic only'
      //   });

      // case employeeNames.length < 4 || employeeNames.length > 50:
      //   return res.status(400).json({
      //     error:
      //       'employee names should not be less than 4 character or more than 50 character'
      //   });

      case nationalId.length < 16 ||
        nationalId.length > 16 ||
        typeof nationalId === 'number':
        return res.status(400).json({
          error: [
            'national Id should be 16 characters',
            'national Id should not be numeric'
          ]
        });

      case emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g names@yahoo.com'
        });
    }
    next();
  }
}

// validation birthday not works
export default inputValidation;
