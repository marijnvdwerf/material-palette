function PriorityQueue(options) {
    this._contents = [];
    this._sorted = false;
    this._comparator = function(a, b) {
        return a - b;
    };
    if (options.comparator !== undefined) {
        this._comparator = options.comparator;
    }
}

PriorityQueue.prototype._sort = function() {
    this._contents.sort(this._comparator);
    this._sorted = true;
};

PriorityQueue.prototype.offer = function(item) {
    this._contents.push(item);
    this._sorted = false;
};

PriorityQueue.prototype.poll = function(item) {
    if (!this._sorted) {
        this._sort();
    }

    return this._contents.shift();
};

PriorityQueue.prototype.peek = function(item) {
    if (!this._sorted) {
        this._sort();
    }

    return this._contents[0];
};

PriorityQueue.prototype.size = function() {
    return this._contents.length;
};

module.exports = PriorityQueue;
