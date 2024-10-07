const { loginService, registerService, checkEmail, logoutService, refreshTokenService } = require("../services/auth.service")
const { object, string } = require('yup');

module.exports = {
    login: async (req, res) => {
        try {
            const clientData = req.body;

            let loginSchema = object({
                email: string('Email phải là kiểu chuỗi')
                    .email('Định dạng email không hợp lệ ...@gmail.com')
                    .required('Email không được để trống'),
                password: string('Mật khẩu phải là kiểu chuỗi')
                    .required('Mật khẩu không được để trống')
                    .min(8, 'Mật khẩu không được nhỏ hơn 8 ký tự'),
            });

            const data = await loginSchema.validate(clientData, {
                abortEarly: false,
            });


            const loginController = await loginService(data, res);



            res.json({ loginController })
        } catch (error) {
            if (error.inner) {
                const errorMessage = Object.fromEntries(
                    error.inner.map(err => [err.path, err.message])
                )
                res.status(500).json({ errorMessage })
            } else {
                res.status(500).json({ errorMessage: error.message })
            }
        }
    },

    register: async (req, res) => {
        try {
            const clientData = req.body;

            let registerSchema = object({
                name: string('Họ tên pjair là kiểu chuỗi')
                    .required('Họ tên không được để trống'),

                email: string('Email phải là kiểu chuỗi')
                    .email('Định dạng email không hợp lệ ...@gmail.com')
                    .required('Email không được để trống')
                    .test('check-unique', 'Email đã tồn tại trong hệ thống', async (value) => {
                        const email = await checkEmail(value);
                        return !email;
                    }),

                password: string('Mật khẩu phải là kiểu chuỗi')
                    .required('Mật khẩu không được để trống')
                    .min(8, 'Mật khẩu không được nhỏ hơn 8 ký tự'),
            });

            const data = await registerSchema.validate(clientData, {
                abortEarly: false,
            });


            const registerController = await registerService(data);


            if (registerController) {
                res.status(200).json({ dataUser: registerController, message: 'Đăng ký thành công!' })
            } else {
                res.status(400).json({ message: 'Đăng ký thất bại!' })
            }

        } catch (error) {
            if (error.inner) {
                const errorMessage = Object.fromEntries(
                    error.inner.map(err => [err.path, err.message])
                )
                res.status(500).json({ errorMessage })
            } else {
                res.status(500).json({ errorMessage: 'Internal Server Error' })
            }
        }
    },

    logout: async (req, res) => {

        try {
            const logoutController = await logoutService(res);
            res.status(200).json({ dataUser: logoutController, message: 'Đăng xuất thành công!' })
        } catch (error) {
            res.status(401).json({ errorMessage: error.message })
        }
    },

    refreshToken: async (req, res) => {
        try {
            const refreshTokenController = await refreshTokenService(req, res);
            res.status(200).json({ accessToken: refreshTokenController })
        } catch (error) {

            res.status(401).json({ errorMessage: error.message })
        }
    }

}