;; Data Collection Contract

(define-data-var next-data-id uint u0)

(define-map health-data
  { data-id: uint }
  {
    source: principal,
    location: (string-ascii 50),
    timestamp: uint,
    symptoms: (list 5 (string-ascii 20)),
    severity: uint
  }
)

(define-public (submit-health-data (location (string-ascii 50)) (symptoms (list 5 (string-ascii 20))) (severity uint))
  (let
    ((data-id (+ (var-get next-data-id) u1)))
    (var-set next-data-id data-id)
    (ok (map-set health-data
      { data-id: data-id }
      {
        source: tx-sender,
        location: location,
        timestamp: block-height,
        symptoms: symptoms,
        severity: severity
      }
    ))
  )
)

(define-read-only (get-health-data (data-id uint))
  (map-get? health-data { data-id: data-id })
)

(define-read-only (get-latest-data-id)
  (var-get next-data-id)
)

