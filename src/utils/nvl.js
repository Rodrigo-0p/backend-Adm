exports.nvl = (value, defaultValue)=> {
	return (value !== null && value !== undefined && value !== "") ? value : defaultValue;
}

