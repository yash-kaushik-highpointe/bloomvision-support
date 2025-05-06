import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "#f8faf3",
    minHeight: 40,
    boxShadow: "none",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
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
    zIndex: 10,
  }),
};

function Dropdown({ options, value, onChange, ...rest }) {
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
      styles={customStyles}
      isSearchable={false}
      menuPlacement="auto"
      {...rest}
    />
  );
}

export default Dropdown;
