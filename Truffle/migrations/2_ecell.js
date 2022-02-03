const Ecell = artifacts.require("Ecell");

module.exports = function (deployer) {
  deployer.deploy(Ecell,10000000);
};
