check: cls
	clarinet check

test-all:
	clarinet test

test-watch:
	clarinet test --watch

cls:
	clear && printf '\e[3J'

cards-test: cls
	clarinet test tests/cards_base_test.ts

info-test: cls
	clarinet test tests/cards_info_test.ts

transfer-test: cls
	clarinet test tests/cards_transfer.ts
