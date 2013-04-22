goog.provide("testing.inject");
goog.require("goog.testing.jsunit");
goog.require("inject");


goog.exportSymbol("test_inject_singleton", function() {
  function A() {}

  function B() {}

  assertTrue(inject(A) instanceof A);
  assertTrue(inject(B) instanceof B);


  var a = inject(A);
  var b = inject(B);
  for (var i = 0; i < 100; i++) {
    assertEquals(a, inject(A));
    assertNotEquals(a, inject(B));
    assertEquals(b, inject(B));
    assertNotEquals(b, inject(A));
  }

})

goog.exportSymbol("test_inject_overrides", function() {
  function A() {};
  function B() {};
  inject.override(A, B);
  assertFalse(inject(A) instanceof A);
  assertTrue(inject(A) instanceof B);
  assertEquals(inject(A), inject(B));
})


goog.exportSymbol("test_inject_type_instance", function() {
  function A() {}

  function B() {}

  inject.register(A, inject.Type.INSTANCE);
  inject.register(B, inject.Type.INSTANCE);

  assertTrue(inject(A) instanceof A);
  assertTrue(inject(B) instanceof B);


  var a = inject(A);
  var b = inject(B);
  for (var i = 0; i < 100; i++) {
    assertNotEquals(a, inject(A));
    assertNotEquals(a, inject(B));
    assertNotEquals(b, inject(B));
    assertNotEquals(b, inject(A));
  }

  var counter = 0;

  function C(a) {
    assertEquals(counter, a);
  }

  for (var i = 0; i < 100; i++) {
    counter++;
    assertTrue(inject(C, counter) instanceof C);
  }


  function D(a) {
    goog.base(this, a);
  }

  goog.inherits(D, C);
  inject.overide(C, D);
  for (var i = 0; i < 100; i++) {
    counter++;
    assertTrue(inject(C, counter) instanceof D);
  }



})