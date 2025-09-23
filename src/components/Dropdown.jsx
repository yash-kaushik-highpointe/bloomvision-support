import React from "react";
import Select from "react-select";

const customStyles = ({ bgColor, border }) => ({
  control: (provided, state) => ({
    ...provided,
    background: bgColor ?? "#f8faf3",
    minHeight: 40,
    boxShadow: "none",
    fontSize: 16,
    borderRadius: 10,
    border: border ?? "none",
    outline: "none",
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#e3e6d3"
      : state.isFocused
      ? "#f0f2ea"
      : "#fff",
    color: "#222",
    fontSize: 16,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1000,
  }),
});

function Dropdown({ options, value, onChange, bgColor, ...rest }) {
  const selectOptions = options.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }));
  const selected = selectOptions.find((opt) => opt.value === value);

  return (
    <Select
      options={selectOptions}
      value={selected}
      onChange={(opt) => onChange(opt.value)}
      styles={customStyles({ bgColor, ...rest })}
      isSearchable={false}
      menuPlacement="auto"
      {...rest}
    />
  );
}

export default Dropdown;
