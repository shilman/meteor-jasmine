describe('suite1', function(){
  beforeAll(function (){
    // Let's do 'cleanup' beforeEach too, in case another suite didn't clean up properly
    spies.restoreAll();
    stubs.restoreAll();
    console.log("I'm beforeAll");
  });
  beforeEach(function (){
    console.log("I'm beforeEach");
    spies.create('log', console, 'log');
  });
  afterEach(function (){
    spies.restoreAll();
    console.log("I'm afterEach");
  });
  afterAll(function (){
    console.log("I'm afterAll");
    spies.restoreAll();
    stubs.restoreAll();
  });
  it('test1', function(){
    console.log('Hello world');
    expect(spies.log).to.have.been.calledWith('Hello world');
  })
});
