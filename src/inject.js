goog.provide('inject');
goog.require('goog.array');
goog.require('goog.asserts');


/**
 * @param {!function(new: T)} ctor
 *        The constructor to inject.
 * @param {...*} var_args
 *        Variable arguments to construct the instance with. Only valid for
 *        non-singleton registrations.
 * @return {!T}
 *        An instance of. @code {T}
 * @template T
 */
inject = function(ctor, var_args) {
  goog.asserts.assertFunction(ctor);
  switch (inject.getInjectionType(ctor)) {
    case inject.Type.SINGLETON:
      goog.asserts.assert(ctor.length == 0);
      var constructor = inject.resolve(ctor);
      var uid = goog.getUid(constructor);
      if (!inject.instances_[uid]) {
        if (goog.isFunction(constructor.getInstance)) {
          inject.instances_[uid] = constructor.getInstance();
        } else {
          var injectedClass = function() {};
          injectedClass.prototype = constructor.prototype;
          var item = new injectedClass();
          inject.instances_[uid] = item;
          constructor.call(item);
        }
      }
      return inject.instances_[uid];
      break;
    case inject.Type.INSTANCE:
      var args = goog.array.slice(arguments, 1);
      return goog.functions.create(ctor, args);
      break;
    default:
      return null;
  }
};


/**
 * @type {Object.<number, Object>}
 * @private
 */
inject.instances_ = {};


/**
 * @type {Object.<number, number>}
 */
inject.overrides_ = {};


/**
 * @param {Function} ctor
 *        The constructor.
 * @param {Function} oCtor
 *        The constructor to override.
 */
inject.override = function(ctor, oCtor) {
  inject.overrides_[goog.getUid(ctor)] = oCtor;
};


/**
 * @param {Function} ctor
 *        The constructor.
 * @return {Function}
 *           Returns the resolved constructor.
 */
inject.resolve = function(ctor) {
  var uid = goog.getUid(ctor);
  var overide = inject.overrides_[uid];
  if (goog.isDefAndNotNull(overide)) {
    return inject.resolve(overide);
  } else {
    return ctor;
  }
};


/**
 * Returns the resolved uid for this constructor.
 *
 * @param {Function} ctor
 *        The constructor function.
 * @return {number}
 *        The uid.
 */
inject.uid = function(ctor) {
  return goog.getUid(inject.resolve(ctor));
};


/**
 * @enum {number} The injection type.
 */
inject.Type = {
  SINGLETON: 0,
  INSTANCE: 1
};


/**
 * @private
 * @type {Object.<number, inject.Type>}
 */
inject.type_ = {};


/**
 * @param {Function} ctor
 *        The constructor.
 * @param {inject.Type} type
 *        The type to register.
 */
inject.register = function(ctor, type) {
  inject.type_[inject.uid(ctor)] = type;
};


/**
 * @return {inject.Type}
 *         The injection type.
 */
inject.getInjectionType = function(ctor) {
  return inject.type_[inject.uid(ctor)] || inject.Type.SINGLETON;
};

