describe('global', function () {
  it('declaring a new global variable should also add it to global', function () {
    foo1 = 'bar';
    expect(global.foo1).toBe('bar');
  });

  it('declaring a property on global should create a global variable', function () {
    global.foo2 = 'bar';
    expect(foo2).toBe('bar');
  });

  it('should delete global variable', function () {
    foo3 = 'bar';
    delete global.foo3;
    expect(typeof foo3).toBe('undefined');
  });
});
