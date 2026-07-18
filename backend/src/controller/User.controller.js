const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require('../utils/ApiResponse');


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
};

const refreshTokenExpiry = {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days => 7 days * 24 hr * 60 mins * 60 sec * 1000 ms
}

const accessTokenExpiry = {
    maxAge: 24 * 60 * 60 * 1000 // 1 Day => 24hr * 60 min * 60 sec * 1000 ms
}


// controllers 

/// userSignUp => help user to sign up on the platform(post)

const userSignUp = asyncHandler(async (req, res) => {

    // Extract data from request

    const { userName, fullName, email, password, phoneNo, countryCode, country, gender, dob } = req.body;


    // check all required fields is there or not
    const fields = { userName, fullName, email, password, phoneNo, countryCode, country, gender }

    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.trim() === "") {
            throw new ApiError(400, `${key} field is required`);
        }
    }


    if (!dob || isNaN(new Date(dob).getTime())) {
        throw new ApiError(400, "Invalid date of birth.");
    }


    if (phoneNo && isNaN(Number(phoneNo))) {
        throw new ApiError(400, "Phone number should be numeric.");
    }

    // check whether user exist with provied email,phoneNo or userName

    const isUserExist = await User.findOne({
        $or: [{ userName }, { email }, { phoneNo }]
    })

    if (isUserExist) {
        throw new ApiError(409, "User with this email, username, or phone number already exists")
    }

    // create new User and check User created Successfully or not
    const user = await User.create({
        userName,
        fullName,
        email,
        password,
        phoneNo,
        countryCode,
        country,
        gender,
        dob
    });


    // generate the access and refresh token and store the refresh token in db

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });


    // remove the password and refreshToken field from created User
    const safeUser = user.toObject();

    delete safeUser.password;
    delete safeUser.refreshToken;

    // send the response to user along with cookies

    res
        .status(201)
        .cookie("refreshToken", refreshToken, { ...cookieOptions, ...refreshTokenExpiry })
        .cookie("accessToken", accessToken, { ...cookieOptions, ...accessTokenExpiry })
        .json(
            new ApiResponse(201, "User Successfully Signed Up", safeUser)
        );




})


// userLogIn => help user to log in on the platform(post)

const userLogIn = asyncHandler(async (req, res) => {
    // extract the user information from the req.body
    let { userName, email, phoneNo, password } = req.body;

    // validate the fields
    if (!userName && !email && !phoneNo) {
        throw new ApiError(400, "Nither userName, email or phoneNo is provided for logIn")
    }

    if (phoneNo && isNaN(Number(phoneNo))) {
        throw new ApiError(400, "Phone number should be numeric.");
    }

    if (!password) {
        throw new ApiError(400, "Password is required for logIn")
    }

    // normalization of fields
    email = email?.trim().toLowerCase();
    userName = userName?.trim();

    // generating the query based on the data provided
    const query = [];
    if (userName) query.push({ userName });
    if (email) query.push({ email });
    if (phoneNo) query.push({ phoneNo });


    // finding the user based on the req.user data

    let user = await User.findOne({
        $or: query
    }).select("+password");

    if (!user) {
        throw new ApiError(404, "User Does not exist");
    }

    // check the provided password is correct or not
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is Incorrect Try Again");
    }

    // generate the tokens and add refresh token in User document

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove the password and refresh token from the user so we can share clean data to frontend
    const safeUser = user.toObject();

    delete safeUser.password;
    delete safeUser.refreshToken;

    // set the cookies in frontend and send the response to the user

    res.status(200)
        .cookie("refreshToken", refreshToken, { ...cookieOptions, ...refreshTokenExpiry })
        .cookie("accessToken", accessToken, { ...cookieOptions, ...accessTokenExpiry })
        .json(
            new ApiResponse(200, "User Successfully Logged In", safeUser)
        );

})

// // userLogOut => help user to loged out from the platform(post)

const userLogOut = asyncHandler(async (req, res) => {
    // fetch the user information using req.user
    const { user } = req;

    // find the user and remove the refresh Token
    user.refreshToken = null;
    user.save({ validateBeforeSave: false });

    // remove the cookies from frontend side and send the response

    res.status(200)
        .clearCookie('refreshToken', cookieOptions)
        .clearCookie('accessToken', cookieOptions)
        .json(new ApiResponse(200, "User Logged Out Successfully", {}));


})

const updateUserPassword = asyncHandler(async (req, res) => {

    // extract User information along with other field(oldPassword, newPassword) from the req object
    const currUser = req.user;
    const { oldPassword, newPassword } = req.body;

    // check whether the fields are provided by user or not
    if (!oldPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(400, "Please Provide Old password and newPassword both are the required field");
    }

    if (oldPassword.trim() === newPassword.trim()) {
        throw new ApiError(400, "New Password can't be same as Old Password")
    }

    // extract the user details with Password

    const user = await User.findById(currUser._id).select("+password");

    // check user exist or not

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    /// check the password is correct or not
    const isPasswordCorrect = await user.comparePassword(oldPassword);


    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current Password is incorrect")
    }

    // update the password
    user.password = newPassword;
    await user.save()

    // send response to user

    let response = res.status(200);

    if (res.locals.refreshToken && res.locals.accessToken) {
        response = response
            .cookie("refreshToken", res.locals.refreshToken, {
                ...cookieOptions,
                ...refreshTokenExpiry
            })
            .cookie("accessToken", res.locals.accessToken, {
                ...cookieOptions,
                ...accessTokenExpiry
            });
    }

    return response.json(
        new ApiResponse(
            200,
            "Password updated successfully."
        )
    );

})



module.exports = {
    userSignUp,
    userLogIn,
    userLogOut,
    updateUserPassword,
};