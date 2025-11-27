import React, { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

function normalizeTo24(input) {
  // Accept formats: HH:MM, H:MM, HH:MM AM/PM, H:MMam, etc.
  if (!input) return '';
  const raw = input.trim().toLowerCase();
  const ampmMatch = raw.match(/\b(am|a\.m\.|pm|p\.m\.)\b/);
  let cleaned = raw.replace(/\s+/g, '');
  // replace dot forms
  cleaned = cleaned.replace(/a\.m\./, 'am').replace(/p\.m\./, 'pm');

  // allow ':' or '/' as separator
  const m = cleaned.match(/^(\d{1,2})[:\/](\d{2})(am|pm)?$/);
  if (!m) return null;
  let hh = Number(m[1]);
  const mm = Number(m[2]);
  const ampm = m[3] || (ampmMatch ? (ampmMatch[1].includes('p') ? 'pm' : 'am') : null);
  if (mm < 0 || mm > 59) return null;
  if (ampm) {
    if (ampm === 'pm' && hh < 12) hh += 12;
    if (ampm === 'am' && hh === 12) hh = 0;
  }
  if (hh < 0 || hh > 23) return null;
  return `${pad(hh)}:${pad(mm)}`;
}

function generateTimeOptions(stepMinutes = 15, start = 7, end = 20) {
  const out = [];
  for (let h = start; h <= end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      out.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return out;
}

export default function TimePicker({ value = '', onChange, className = '' }) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const hours = Array.from({ length: 12 }, (_, i) => i + 1).map(h => pad(h));
  const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
  const ampm = ['AM', 'PM'];

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selectFromParts = (h12, m, ap) => {
    let hh = Number(h12);
    const mm = Number(m);
    if (ap === 'PM' && hh < 12) hh += 12;
    if (ap === 'AM' && hh === 12) hh = 0;
    const out = `${pad(hh)}:${pad(mm)}`;
    setInputValue(out);
    onChange && onChange(out);
    setOpen(false);
  };

  const handleBlurParse = () => {
    const normalized = normalizeTo24(inputValue);
    if (normalized) {
      setInputValue(normalized);
      onChange && onChange(normalized);
    }
  };

  // derive current selections for highlighting
  const current = normalizeTo24(inputValue) || '';
  const curParts = current ? current.split(':') : [null, null];
  const curH24 = curParts[0] ? Number(curParts[0]) : null;
  const curM = curParts[1] || null;
  const curH12 = curH24 !== null ? ((curH24 % 12) === 0 ? 12 : curH24 % 12) : null;
  const curAmpm = curH24 !== null ? (curH24 >= 12 ? 'PM' : 'AM') : null;

  return (
    <div className={`timepicker-wrapper position-relative ${className}`} ref={ref}>
      <div className="time-input-group d-flex align-items-center">
        <input
          className="form-control time-input"
          value={inputValue}
          placeholder="HH:MM"
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlurParse}
          aria-label="Hora"
        />
        <button type="button" className="btn btn-outline-secondary ms-2 timepicker-toggle" onClick={() => setOpen(s => !s)} aria-label="Abrir selector de hora">⏱️</button>
      </div>

      {open && (
        <div className="timepicker-popover card p-2 mt-2">
          <div className="timepicker-columns d-flex">
            <div className="col-hours col-scroll">
              {hours.map(h => (
                <button key={h} type="button" className={`time-option btn ${curH12 && Number(curH12) === Number(h) ? 'btn-primary text-white' : 'btn-light'}`} onClick={() => selectFromParts(h, curM || '00', curAmpm || 'AM')}>
                  {h}
                </button>
              ))}
            </div>
            <div className="col-minutes col-scroll">
              {minutes.map(m => (
                <button key={m} type="button" className={`time-option btn ${curM === m ? 'btn-primary text-white' : 'btn-light'}`} onClick={() => selectFromParts(curH12 ? pad(curH12) : '12', m, curAmpm || 'AM')}>
                  {m}
                </button>
              ))}
            </div>
            <div className="col-ampm col-scroll">
              {ampm.map(a => (
                <button key={a} type="button" className={`time-option btn ${curAmpm === a ? 'btn-primary text-white' : 'btn-light'}`} onClick={() => selectFromParts(curH12 ? pad(curH12) : '12', curM || '00', a)}>
                  {a.toLowerCase().replace('am','a.m.').replace('pm','p.m.')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
