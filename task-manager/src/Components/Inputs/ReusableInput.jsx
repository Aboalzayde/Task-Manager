import React from "react";

const ReusableInput = ({
  type,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options = [],
  placeholder,
  label
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} :</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="">-- Select {label} --</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
        />
      )}
      {error && touched && <div className="error">{error}</div>}
    </div>
  );
};

export default ReusableInput;