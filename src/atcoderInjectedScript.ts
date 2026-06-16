import { ContentScriptData } from './types';
import log from './log';

declare const ace: any;

log('cph-submit atcoder script injected');

const idToAtcoderLanguage: Record<number, string> = {
    91: 'C++23 (GCC 15.2.0)',
    89: 'C++ IOI-Style(GNU++20) (GCC 14.2.0)',
    52: 'C++23 (Clang 21.1.0)',
    43: 'C23 (GCC 14.2.0)',
    79: 'C# 13.0 (.NET 9.0.8)',
    28: 'D (DMD 2.111.0)',
    87: 'Java24 (OpenJDK 24.0.2)',
    88: 'Kotlin (Kotlin/JVM 2.2.10)',
    19: 'OCaml (ocamlopt 5.3.0)',
    4: 'Pascal (fpc 3.2.2)',
    13: 'Perl (perl 5.38.2)',
    6: 'PHP (PHP 8.4.12)',
    55: 'JavaScript (Node.js 22.19.0)',
    31: 'Python (CPython 3.13.7)',
    70: 'Python (PyPy 3.11-v7.3.20)',
    67: 'Ruby 3.4 (ruby 3.4.5)',
    32: 'Go (go 1.25.1)',
    98: 'Rust (rustc 1.89.0)',
    20: 'Scala (Dotty 3.7.2)',
    12: 'Haskell (GHC 9.8.4)',
};

chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'cph-submit-Atcoder') return;

    const { sourceCode, languageId } = message;
    const languageText = idToAtcoderLanguage[languageId];

    if (!languageText) {
        alert('The following language is not supported');
        return;
    }

    const selectBox = document.querySelector(
        'select[name="data.LanguageId"]',
    ) as HTMLSelectElement;

    if (selectBox) {
        const options = Array.from(selectBox.options);
        const targetOption = options.find(
            (opt) => opt.text.trim() === languageText,
        );

        if (targetOption) {
            const atcoderValue = targetOption.value;
            selectBox.value = atcoderValue;
            selectBox.dispatchEvent(new Event('change', { bubbles: true }));
            log(
                `Successfully set language to ${languageText} (Value: ${atcoderValue})`,
            );
        } else {
            log(
                `Error: Could not find an option matching the text "${languageText}" in the dropdown.`,
            );
        }
    } else {
        log(
            'Error: Could not find the AtCoder language select box on this page.',
        );
    }

    const cloudFareVerificationChecker = setInterval(() => {
        const tokenInput = document.querySelector(
            'input[name="cf-turnstile-response"]',
        ) as HTMLInputElement | null;

        if (tokenInput && tokenInput.value) {
            document.getElementById('submit')?.click();
        }
    }, 250);
});
