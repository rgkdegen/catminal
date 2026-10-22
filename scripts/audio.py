"""Synthesizes the CATMINAL soundtrack: ambient pad, tick hats, per-case blips, swipe whoosh + thud on rugs, chime on apes."""
import numpy as np, wave, os, sys
SR=44100; DUR=30.0; n=int(SR*DUR); t=np.arange(n)/SR
rng=np.random.default_rng(3)
out=np.zeros(n)
T0, D = 1.35, 2.15
PASS={2,6,10}

def add(sig, at):
    i=int(at*SR); j=min(n, i+len(sig)); out[i:j]+=sig[:j-i]

def env(L, a=0.005, r=0.1):
    k=np.arange(int(L*SR))/SR
    return np.minimum(1, k/a)*np.exp(-k/r)

def tone(f, L, a=0.005, r=0.1, amp=0.3):
    k=np.arange(int(L*SR))/SR
    return amp*np.sin(2*np.pi*f*k)*env(L,a,r)

# ambient pad: low drone with slow movement + soft noise bed
pad=0.06*np.sin(2*np.pi*55*t)+0.04*np.sin(2*np.pi*82.4*t+0.5*np.sin(2*np.pi*0.1*t))+0.025*np.sin(2*np.pi*110*t)*(0.6+0.4*np.sin(2*np.pi*0.23*t))
noise=rng.standard_normal(n); lp=np.convolve(noise, np.ones(60)/60, 'same')
out+=pad+0.05*lp
# hi-hat-ish ticks every 1/4 s
for k in np.arange(0, DUR, 0.25):
    L=0.04; s=rng.standard_normal(int(L*SR))*env(L,0.001,0.008)*0.05
    s=s-np.convolve(s,np.ones(6)/6,'same'); add(s,k)
# per-case sounds
for i in range(12):
    b=T0+i*D
    add(tone(1320,0.12,r=0.03,amp=0.12), b)                 # new token blip
    for q in range(4): add(tone(880+q*110,0.06,r=0.015,amp=0.07), b+0.3+q*0.17)  # travel ticks
    k=np.arange(int(0.3*SR))/SR                               # compute whirr
    add(0.05*np.sin(2*np.pi*(300+900*k/0.3)*k)*np.minimum(1,k/0.02)*np.exp(-k/0.2), b+1.0)
    if i in PASS:
        add(tone(660,0.5,r=0.18,amp=0.16), b+1.38); add(tone(990,0.6,r=0.22,amp=0.14), b+1.5); add(tone(1320,0.6,r=0.25,amp=0.08), b+1.62)
    else:
        L=0.35; k=np.arange(int(L*SR))/SR                     # whoosh (swipe)
        w=rng.standard_normal(len(k)); w=np.convolve(w,np.ones(8)/8,'same')*np.sin(np.pi*k/L)**2*0.22
        add(w, b+1.4)
        add(tone(70,0.3,r=0.09,amp=0.35), b+1.57)             # thud
        add(tone(220,0.15,r=0.05,amp=0.08), b+1.57)
# outro swell + final swipe + chime
O=T0+12*D
k=np.arange(int(2.8*SR))/SR
add(0.08*np.sin(2*np.pi*110*k)*np.minimum(1,k/0.8)*np.exp(-k/2.5)+0.06*np.sin(2*np.pi*165*k)*np.minimum(1,k/0.8)*np.exp(-k/2.5), O)
L=0.35; kk=np.arange(int(L*SR))/SR; w=np.convolve(rng.standard_normal(len(kk)),np.ones(8)/8,'same')*np.sin(np.pi*kk/L)**2*0.25; add(w,O+1.2)
add(tone(70,0.3,r=0.09,amp=0.35), O+1.35)
add(tone(880,0.8,r=0.3,amp=0.12), O+1.6); add(tone(1320,0.9,r=0.35,amp=0.1), O+1.7)
# fade
fade=np.ones(n); fl=int(0.6*SR); fade[-fl:]=np.linspace(1,0,fl); fade[:int(.2*SR)]=np.linspace(0,1,int(.2*SR))
out*=fade; out/=np.max(np.abs(out))*1.15
st=np.stack([out,out],1)
dest=sys.argv[1] if len(sys.argv)>1 else 'audio.wav'
with wave.open(dest,'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st*32767).astype(np.int16).tobytes())
print('ok')
