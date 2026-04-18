import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./../../auth/auth.css";

interface passwordFieldTypes {
  label: string;
  state: string;
  setState: (e: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PasswordField = ({ label, state, setState, placeholder, disabled }: passwordFieldTypes) => {
  const [passwordReadable, setPasswordReadable] = useState(false);

  const togglePasswordType = () => {
    setPasswordReadable((prev) => !prev);
  };

  return (
    <>
      <label>{label}</label>
      <div className="password-wrapper">
        <input
          type={passwordReadable ? "text" : "password"}
          placeholder={placeholder ? placeholder : label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          disabled={disabled}
        />
        <FontAwesomeIcon
          className="btn"
          icon={passwordReadable ? faEyeSlash : faEye}
          onClick={togglePasswordType}
        />
      </div>
    </>
  );
};

export default PasswordField;
