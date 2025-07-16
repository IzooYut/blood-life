<?php

namespace App\Traits;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;

trait PDFExportable
{
    public function generatePdf(string $view, array $data, string $outputPath): string
    {
           $directory = dirname($outputPath);
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $pdf = Pdf::loadView($view, $data)->setPaper('A4', 'landscape');

        file_put_contents($outputPath, $pdf->output());

        return $outputPath;
    }
}
