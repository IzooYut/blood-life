@props([
    'title' => 'Blood Requests Report',
    'columns' => [],
    'rows' => [],
    'summary' => [],
    'filters' => [],
    'timestamp'=>''
])

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        @page {
            margin: 1.5cm 1.2cm;
            size: A4 landscape;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #222;
            line-height: 1.5;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .logo {
            height: 50px;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #0B0146;
            text-align: right;
        }

        h2 {
            font-size: 18px;
            text-align: center;
            margin-top: 0;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 8px 6px;
            text-align: left;
            vertical-align: top;
            word-wrap: break-word;
            word-break: break-word;
        }

        th {
            background-color: #f3f3f3;
            font-weight: bold;
        }

        tfoot td {
            font-weight: bold;
            background-color: #f5f5f5;
        }

        tbody tr:nth-child(odd) {
            background-color: #fbfbfb;
        }

        .col-goods {
            width: 18%;
        }

        .col-dimensions {
            width: 15%;
        }

        .col-default {
            width: auto;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            font-size: 11px;
            color: #555;
            text-align: center;
        }

        .pagenum:before {
            content: counter(page);
        }

        .summary-row {
            margin-top: 10px;
            font-size: 13px;
            font-weight: bold;
        }
        tfoot td {
    font-weight: bold;
    background-color: #e5e7eb;
    border-top: 2px solid #999;
}

    </style>
</head>
<body>

    {{-- Header --}}
    <div class="header">
        <img src="{{ public_path('width-250px.png') }}" class="logo" alt="Company Logo">
        <div class="company-name">Donation Life</div>
        
    </div>

    {{-- Title --}}
    <h2>{{ $title }}</h2>

    @if (!empty($filters))
    <div style="text-align: center; font-size: 12px; margin-bottom: 8px;">
        <strong></strong> {{ implode(' | ', $filters) }}
    </div>
@endif

@if (!empty($timestamp))
    <div style="text-align: center; font-size: 11px; margin-bottom: 8px;">
        Exported on: {{ $timestamp }}
    </div>
@endif

    {{-- Table --}}
    <table>
        <thead>
            <tr>
                @foreach ($columns as $col)
                    <th
                        @if (Str::contains(strtolower($col), 'goods')) class="col-goods"
                        @elseif (Str::contains(strtolower($col), 'dimension')) class="col-dimensions"
                        @else class="col-default"
                        @endif
                    >{{ $col }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    @foreach ($row as $cell)
                        <td>{!! nl2br(e($cell)) !!}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($columns) }}" style="text-align: center;">No data available</td>
                </tr>
            @endforelse
        </tbody>
       
          <tfoot>
    <tr>
        <td colspan="8"></td> 
        <td><strong>{{ $summary['total'] ?? '' }}</strong></td>
        <td><strong>{{ $summary['discount'] ?? '' }}</strong></td>
    </tr>
</tfoot>
    </table>

    {{-- Footer --}}
    <div class="footer">
        Page <span class="pagenum"></span>
    </div>
</body>
</html>
