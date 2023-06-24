exports.getLogDate = function getLogDate() {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${year}-${(month < 10) ? "0" : ""}${month}-${(day < 10) ? "0" : ""}${day} ${(hours < 10) ? "0" : ""}${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`
}
