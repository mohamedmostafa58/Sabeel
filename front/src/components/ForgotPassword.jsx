import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../css/forgotPassword.module.css";
import { forgotPassword, reset } from "../redux/authSlice";
import FormInput from "./FormInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    } else if (isSuccess) {
      toast.success(message);
      navigate("/");
    }
    dispatch(reset());
  }, [isSuccess, isError, message, navigate, dispatch]);

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
      errormessage: "It should be a valid email",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className={`${styles.forgotPassword} bg-blue-100`}>
      <form onSubmit={handleSubmit} className="bg-cyan-700">
        <h1 className="text-red-900 text-2xl font-bold">Forgot Password</h1>
        <p className="text-white">
          Please enter the email address you registered your account with. We
          will send you the reset password link to this email.
        </p>
        {inputs.map((input) => (
          <FormInput
            className={styles.formInput}
            key={input.id}
            {...input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ))}
        <button type="submit">Send Email</button>
        <span className="text-black-900 text-xl font-meduim">
          Want to login? <Link to="/login" className="text-red-800">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;
