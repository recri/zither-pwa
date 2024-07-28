FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
TARGETDIR=../src/faust
ASSETDIR=../assets/faust
OUTTSCDIR=../out-tsc/src/faust
FILES=	$(TARGETDIR)/eks.html \
	$(TARGETDIR)/ks.html \
	$(TARGETDIR)/sitar.html \
	$(TARGETDIR)/elecGuitar.html \
	$(TARGETDIR)/nylonGuitar.html \
	$(TARGETDIR)/steelGuitar.html \
	$(TARGETDIR)/bass.html

FILES=	$(TARGETDIR)/eks.html


$(TARGETDIR)/%.html: ./src/%.dsp
	$(FAUSTWASM) $< $(TARGETDIR)

all:: $(FILES)
	#for f in `$(MAKE) -silent echo`; do $(MAKE) $$f; done
	mkdir -p $(ASSETDIR) 
	mkdir -p $(TARGETDIR)/faustwasm
	mkdir -p $(OUTTSCDIR)/faustwasm
	mv $(TARGETDIR)/*.wasm $(TARGETDIR)/*.json $(ASSETDIR)
	rm -fr $(TARGETDIR)/*
	# my server chokes on the delivered index.js
	# cp ./src/index.xx $(TARGETDIR)/faustwasm/index.js
	# the typescript compiler complains about a type
	# cp ./src/index.d.xx $(TARGETDIR)/faustwasm/index.d.ts
	# the typescript compiler doesn't copy this
	# rsync -av $(TARGETDIR)/ $(OUTTSCDIR)/

clean:: ; rm -rf $(TARGETDIR)/* $(ASSETDIR)/*

echo:: ; echo $(FILES)
