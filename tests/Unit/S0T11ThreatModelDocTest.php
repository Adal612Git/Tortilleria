<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class S0T11ThreatModelDocTest extends TestCase
{
    private string $docPath = __DIR__ . '/../../tortilleria/docs/threat-model-s0t11.md';

    public function test_threat_model_document_exists(): void
    {
        $this->assertFileExists($this->docPath);
    }

    public function test_threat_model_document_has_at_least_six_threats(): void
    {
        $contents = file_get_contents($this->docPath);
        preg_match_all('/^### /m', $contents, $matches);
        $this->assertGreaterThanOrEqual(6, count($matches[0]));
    }
}
