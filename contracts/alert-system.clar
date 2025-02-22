;; Alert System Contract

(define-map alerts
  { alert-id: uint }
  {
    pattern-id: uint,
    severity: uint,
    timestamp: uint,
    message: (string-utf8 500)
  }
)

(define-data-var next-alert-id uint u0)

(define-constant CONTRACT_OWNER tx-sender)

(define-public (issue-alert (pattern-id uint) (severity uint) (message (string-utf8 500)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u403))
    (let
      ((alert-id (+ (var-get next-alert-id) u1)))
      (var-set next-alert-id alert-id)
      (ok (map-set alerts
        { alert-id: alert-id }
        {
          pattern-id: pattern-id,
          severity: severity,
          timestamp: block-height,
          message: message
        }
      ))
    )
  )
)

(define-read-only (get-alert (alert-id uint))
  (map-get? alerts { alert-id: alert-id })
)

(define-read-only (get-latest-alert-id)
  (var-get next-alert-id)
)

