require('dotenv').config()
const { User } = require('../models');
const bcrypt = require('bcrypt');
const ms = require('ms');


const { generateToken, verifyToken } = require('../providers/JwtProvider');

module.exports = {
    loginService: async (data, res) => {
        const { email, password } = data;

        // Kiểm tra email có trong cơ sở dữ liệu không
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error('Email không tồn tại!');
        }

        // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Mật khẩu không đúng!');
        }

        // Xử lý dữ liệu khi nhập đúng
        const userInfo = {
            id: user.id,
            email: user.email,
        }



        // Tạo 2 lạo token access và refresh
        const accessToken = await generateToken(
            userInfo,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
            process.env.TIME_LIVING_ACCESS_TOKEN, // Thời gian sống token mặc định là 1h
        );
        const refreshToken = await generateToken(
            userInfo,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
            process.env.TIME_LIVING_REFRESH_TOKEN, // Thời gian sống refresh token mặc định là 60 ngày
        );

        // Set accessToken vào cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days')
        })

        // Set refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days')
        })


        return {
            ...userInfo,
            accessToken,
            refreshToken,
        }
    },

    registerService: async (data) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const dataValue = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            status: true,
        }

        const dataInsert = await User.create(dataValue);

        const { password, ...userWithoutPassword } = dataInsert.dataValues;

        return userWithoutPassword
    },
    logoutService: (res) => {


        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });


        return true;
    },
    refreshTokenService: async (req, res) => {
        const refreshTokenFromCookie = req.cookies?.refreshToken;

        const refreshTokenDecoded = await verifyToken(
            refreshTokenFromCookie,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
        )


        const userInfo = {
            id: refreshTokenDecoded.id,
            email: refreshTokenDecoded.email,
        }

        const accessToken = await generateToken(
            userInfo,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
            process.env.TIME_LIVING_ACCESS_TOKEN,// Thời gian sống token mặc định là 1h
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days')
        })


        return accessToken

    },
    checkEmail: async (data) => {
        try {
            const dataValue = await User.findOne({
                attributes: ['email'],
                where: { email: data }
            });
            if (dataValue == null) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            throw new Error("Database error");
        }
    }
}