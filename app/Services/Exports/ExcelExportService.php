<?php 
namespace App\Services\Exports;

use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ExcelExportService
{
        public function export(string $title, array $columns, array $data, ?array $summary = null, ?string $filename = null)
        {
            $exportData = $data;

            if($summary)
            {
                $exportData[] = $summary;
            }

                $export = new class($columns, $exportData, $title) implements FromArray, WithHeadings, WithTitle {
            protected $columns;
            protected $data;
            protected $title;

            public function __construct($columns, $data, $title)
            {
                $this->columns = $columns;
                $this->data = $data;
                $this->title = $title;
            }

            public function array(): array
            {
                return $this->data;
            }

            public function headings(): array
            {
                return $this->columns;
            }

            public function title(): string
            {
                return substr($this->title, 0, 31);
            }
        };

        $filename = $filename ?? strtolower(str_replace(' ', '_', $title)) . '.xlsx';
        return Excel::download($export, $filename);
        }
}