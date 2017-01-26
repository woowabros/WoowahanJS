module.exports = {
	get: function(key) {
		return localStorage.getItem(key);
	},
	set: function(key , data) {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	},
	delete: function(key) {
		localStorage.removeItem(key);
		return true;
	}
};