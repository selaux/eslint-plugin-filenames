var sinon = require("sinon");

beforeEach(function () {
    sinon.stub(process, "cwd").returns('/foo');
});

afterEach(function () {
    process.cwd.restore();
});
