<?php

namespace App\Services\Exports;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfExportService
{
    public function export(string $title, array $columns, array $data, ?array $summary = null, ?string $filename = null)
    {
        $pdf = Pdf::loadView('exports.pdf', [
            'title' => $title,
            'columns' => $columns,
            'data' => $data,
            'summary' => $summary
        ])->setPaper('a4', 'landscape');

        $filename = $filename ?? strtolower(str_replace(' ', '_', $title)) . '.pdf';
        return $pdf->download($filename);
    }
}
