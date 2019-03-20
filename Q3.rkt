#lang racket

(provide (all-defined-out))

;; Signature: ngrams(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat))
;;        (ngrams '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat))
(define ngrams
  (lambda (los n)
    (if(= (length los) 0)
      '()
      (if (< (length los) n)
        '()
        (cons (chain los n) (ngrams (cdr los) n))))))

(define chain
  (lambda (los n)
    (if (> n 0)
      (cons (car los) (chain (cdr los) (- n 1)))
      (list) )))

;; Signature: ngrams-with-padding(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols, padding if necessary
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams-with-padding '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat) (the hat *) (hat * *))
;;        (ngrams-with-padding '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat) (hat *))
(define ngrams-with-padding
  (lambda (los n)
    (if (= (length los) 0)
      '()
      (cons (chain-with-padding los n) (ngrams-with-padding (cdr los) n)))))

(define chain-with-padding
  (lambda (los n)
    (if (> n 0)
      (if (> (length los) 0)
        (cons (car los) (chain-with-padding (cdr los) (- n 1)))
        (cons '* (chain-with-padding (list) (- n 1))))
      (list) )))