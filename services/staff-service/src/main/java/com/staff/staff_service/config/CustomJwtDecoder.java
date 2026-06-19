package com.staff.staff_service.config;

import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

@Component
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            MACVerifier verifier = new MACVerifier(signerKey.getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new JwtException("Invalid JWT signature");
            }

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime != null && expirationTime.before(new Date())) {
                throw new JwtException("JWT token has expired");
            }

            var claims = signedJWT.getJWTClaimsSet();
            Instant issuedAt = claims.getIssueTime() != null ? claims.getIssueTime().toInstant() : Instant.now();
            Instant expiresAt = expirationTime != null ? expirationTime.toInstant() : Instant.now().plusSeconds(3600);

            return Jwt.withTokenValue(token)
                    .header("alg", signedJWT.getHeader().getAlgorithm().getName())
                    .claims(c -> {
                        try {
                            c.putAll(claims.toJSONObject());
                        } catch (Exception e) {
                            throw new JwtException("Failed to parse JWT claims");
                        }
                    })
                    .issuedAt(issuedAt)
                    .expiresAt(expiresAt)
                    .build();

        } catch (ParseException | com.nimbusds.jose.JOSEException e) {
            throw new JwtException("Failed to decode JWT: " + e.getMessage());
        }
    }
}
