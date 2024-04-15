import React, { useState } from 'react';
import { signUpUser } from "../api/AuthApi";
import logo from "./Logo.png";

const SignupPage = () => {
    const [userData, setUserData] = useState({
        firstName: 'Dicky',
        lastName: 'Yuen',
        mobile: '12345678',
        email: '1234@gmail.com',
        userName: 'Dicky',
        password: '12345678',
        company: 'Venturenix',
        title: 'Director',
        status: 'A',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!userData.firstName.trim() || userData.firstName.trim().length < 3 || userData.firstName.trim().length > 20) {
            errors.firstName = 'First name must be between 3 and 20 characters';
            isValid = false;
        }

        if (!userData.lastName.trim() || userData.lastName.trim().length < 3 || userData.lastName.trim().length > 20) {
            errors.lastName = 'Last name must be between 3 and 20 characters';
            isValid = false;
        }

        if (!userData.userName.trim() || userData.userName.trim().length < 3 || userData.userName.trim().length > 20) {
            errors.userName = 'User name must be between 3 and 20 characters';
            isValid = false;
        }

        if (!userData.password.trim() || userData.password.trim().length < 6 || userData.password.trim().length > 40) {
            errors.password = 'Password must be between 6 and 40 characters';
            isValid = false;
        }

        if (!userData.mobile.trim() || userData.mobile.trim().length < 6 || userData.mobile.trim().length > 40) {
            errors.mobile = 'Mobile must be between 6 and 40 characters';
            isValid = false;
        }

        if (!userData.title.trim() || userData.title.trim().length < 6 || userData.title.trim().length > 40) {
            errors.title = 'Title must be between 6 and 40 characters';
            isValid = false;
        }

        if (!userData.status.trim() || userData.status.trim().length < 1 || userData.status.trim().length > 20) {
            errors.status = 'Status must be between 1 and 20 characters';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                console.log(userData);
                await signUpUser(userData);
                alert('Signup successful');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    const handleBack = async () => {
                window.location.href = '/';
    };

    return (
        <div className="container"
             style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
             }}
        >
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img
                                src={logo}
                                className="img-fluid"
                                alt="Sample image"
                            />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <h2 className="mb-4">Signup</h2>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">First Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleChange}
                                    />
                                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mobile:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mobile"
                                        value={userData.mobile}
                                        onChange={handleChange}
                                    />
                                    {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">User Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userName"
                                        value={userData.userName}
                                        onChange={handleChange}
                                    />
                                    {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Company:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="company"
                                        value={userData.company}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={userData.title}
                                        onChange={handleChange}
                                    />
                                    {errors.title && <div className="text-danger">{errors.title}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="status"
                                        value={userData.status}
                                        onChange={handleChange}
                                    />
                                    {errors.status && <div className="text-danger">{errors.status}</div>}
                                </div>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Signup
                                </button>
                                <button type="button" className="btn btn-primary" style={{marginLeft:'20px'}} onClick={handleBack}>
                                    Back
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SignupPage;