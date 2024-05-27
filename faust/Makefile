FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js -poly
#FAUSTWASM= node ../node_modules/@grame/faustwasm/scripts/faust2wasm.js
SRCDIR=./src
TMPDIR=./faust
# some of the results go into /assets 
# so they can be fetch()'ed at an absolute path
# both in the test server and the final build
ASSETDIR=../assets/faust
# some of the results go into the typescript output tree
# so they can be import'ed by other source modules and
# found for postprocessing into the rolled up dist.
OUTTSCDIR=../out-tsc/src/faust
OUTSRCDIR=../src/faust/
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
	# remove all html and js files
	rm -f $(TMPDIR)/*.html $(TMPDIR)/*.js
	# move the faustwasm files into the source tree
	rm -fr $(OUTSRCDIR); rsync -av $(TMPDIR)/ $(OUTSRCDIR)/
	# modify the faustwasm/index.d.ts file, soundfiles is optional
	sed -i 's/soundfiles: Record/soundfiles?: Record/' $(OUTSRCDIR)/faustwasm/index.d.ts 
	# modify the faustwasm/index.js file, remove nodejs clause	
	sed -i '20,46d' $(OUTSRCDIR)/faustwasm/index.js
	# clean up the rest
	rm -fr $(TMPDIR)/*
	# install the faustwasm files into $(OUTTSCDIR)
	mkdir -p $(OUTTSCDIR)
	rsync -av $(OUTSRCDIR)/ $(OUTTSCDIR)/

clean:: ; rm -rf $(TMPDIR)/* $(ASSETDIR)/*

