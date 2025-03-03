import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../hooks";
import { RegisterData, UserType } from "../../../types";
import "./RegisterPage.css";

type SignupFormInputs = RegisterData & {
  confirmPassword: string;
};

const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": "Please confirm your password",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  surname: Joi.string().required().messages({
    "string.empty": "Surname is required",
  }),
  type: Joi.string()
    .valid(...Object.values(UserType))
    .required()
    .messages({
      "string.empty": "User type is required",
      "any.only": "Invalid user type",
    }),
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>({
    resolver: joiResolver(signupSchema),
  });
  const { signup } = useAuth();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;

      await signup(registerData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h4 className="text-center mb-4">Create Account</h4>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Surname</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.surname ? "is-invalid" : ""
                      }`}
                      {...register("surname")}
                    />
                    {errors.surname && (
                      <div className="invalid-feedback">
                        {errors.surname.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">User Type</label>
                    <select
                      className={`form-select ${
                        errors.type ? "is-invalid" : ""
                      }`}
                      {...register("type")}
                    >
                      <option value="">Select user type</option>
                      {Object.entries(UserType).map(([key, value]) => (
                        <option key={key} value={value}>
                          {key.charAt(0) + key.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <div className="invalid-feedback">
                        {errors.type.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      {...register("password")}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Sign Up"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
