export const merge = function<T, S>
( t: T, s: S ) : T & S {
  const res: any = {}
  // copy
  for ( const k in t ) {
    if ( t.hasOwnProperty ( k ) ) {
      res [ k ] = t [ k ]
    }
  }
  // merge
  for ( const k in s ) {
    if ( s.hasOwnProperty ( k ) ) {
      res [ k ] = s [ k ]
    }
  }
  return res
}
