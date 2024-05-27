FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
#FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js
SRCDIR=./src
TMPDIR=./tmp
# some of the results go into /assets 
# so they can be fetch()'ed at an absolute path
# both in the test server and the final build
ASSETDIR=../assets/faust
# some of the results go into the typescript output tree
# so they can be import'ed by other source modules and
# found for postprocessing into the rolled up dist.
OUTTSCDIR=../out-tsc/src/faustwasm
# the files
FILES=	$(TMPDIR)/eks.html \
	$(TMPDIR)/eks2.html \
	$(TMPDIR)/ks.html \
	$(TMPDIR)/sitar.html \
	$(TMPDIR)/elecGuitar.html \
	$(TMPDIR)/nylonGuitar.html \
	$(TMPDIR)/steelGuitar.html \
	$(TMPDIR)/bass.html

# simplify the files
FILES=  $(TMPDIR)/eks2.html

$(TMPDIR)/%.html: $(SRCDIR)/%.dsp
	$(FAUSTWASM) $< $(TMPDIR)

all:: $(FILES)
	# move all json and wasm files
	mv $(TMPDIR)/*.wasm $(TMPDIR)/*.json $(ASSETDIR)
	# move the faustwasm files into the source tree
	rm -fr ../src/faustwasm; mv $(TMPDIR)/faustwasm ../src
	# modify the faustwasm/index.d.ts file, soundfiles is optional
	sed -i 's/soundfiles: Record/soundfiles?: Record/' ../src/faustwasm/index.d.ts 
	# modify the faustwasm/index.js file, remove nodejs clause	
	sed -i '20,46d' ../src/faustwasm/index.js
	# clean up the rest
	rm -fr $(TMPDIR)/*
	# install the faustwasm files into $(OUTTSCDIR)
	mkdir -p $(OUTTSCDIR)
	rsync -av ../src/faustwasm/ $(OUTTSCDIR)/

clean:: ; rm -rf $(TMPDIR)/* $(ASSETDIR)/*

