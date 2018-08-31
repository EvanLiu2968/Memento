/**
 * Time:  O(1)
 * Space: O(1)
 *
 * Multi coordinate transform.
 *
 * For example,
 * sphericalToThree（球极坐标系，又称空间极坐标，是三维坐标系的一种，它以坐标原点为参考点，由方位角、仰角和距离构成）
 * give (1, 45, 45), returns (0.5，0.5，0.707)
 *
 */
'use strict';

/**
 * spherical-coordinate to 3D-coordinate
 * @param  {r, α, β}
 * @return {x, y, z}
 */
exports.sphericalToThree = function(r = 0, α = 0, β = 0){
  α = (α/180)*Math.PI
  β = (β/180)*Math.PI
  return {
    x: r*Math.sin(α)*Math.cos(β),
    y: r*Math.sin(α)*Math.sin(β),
    z: r*Math.cos(α)
  }
}

/**
 * 3D-coordinate to spherical-coordinate
 * @param  {x, y, z}
 * @return {r, α, β}
 */
exports.threeToSpherical = function(x = 0, y = 0, z = 0){
  const r = Math.sqrt(x*x+y*y+z*z);
  return {
    r: r,
    α: Math.acos(z/r),
    β: Math.atan(y/x)
  }
}